package com.acabados1a.backend.service;

import com.acabados1a.backend.dto.LoginRequest;
import com.acabados1a.backend.dto.NuevaPasswordRequest;
import com.acabados1a.backend.dto.RegistroRequest;
import com.acabados1a.backend.model.Rol;
import com.acabados1a.backend.model.Usuario;
import com.acabados1a.backend.repository.RolRepository;
import com.acabados1a.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    // id_rol = 2 (Cliente) para todo self-registro — mismo orden de roles que ya asume
    // frontend/src/stores/auth.js (1 Administrador, 2 Cliente).
    private static final int ID_ROL_CLIENTE = 2;
    private static final int VIGENCIA_CODIGO_MINUTOS = 15;
    private static final int MAX_INTENTOS_CODIGO = 5;

    // Referenciado también desde AuthController para poder distinguir esta causa de login()
    // fallido de las demás sin comparar el texto del mensaje (frágil - ver LoginView.vue).
    public static final String MSG_CUENTA_NO_VERIFICADA = "Debes verificar tu correo antes de iniciar sesión.";

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();

    public Usuario registrar(RegistroRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Ya existe una cuenta registrada con ese correo.");
        }
        if (request.getNumeroIdentificacion() != null && !request.getNumeroIdentificacion().isBlank()
            && usuarioRepository.existsByNumeroIdentificacion(request.getNumeroIdentificacion())) {
            throw new IllegalArgumentException("Ya existe una cuenta registrada con ese número de identificación.");
        }

        Rol rolCliente = rolRepository.findById(ID_ROL_CLIENTE)
            .orElseThrow(() -> new IllegalStateException("El rol Cliente (id_rol=2) no existe en la base de datos."));

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        if (request.getTipoIdentificacion() != null && !request.getTipoIdentificacion().isBlank()) {
            usuario.setTipoIdentificacion(Usuario.TipoIdentificacion.valueOf(request.getTipoIdentificacion()));
        }
        usuario.setNumeroIdentificacion(request.getNumeroIdentificacion());
        usuario.setEmail(request.getEmail());
        usuario.setTelefono(request.getTelefono());
        usuario.setWhatsapp(request.getWhatsapp());
        usuario.setDireccion(request.getDireccion());
        usuario.setCiudad(request.getCiudad());
        usuario.setDepartamento(request.getDepartamento());
        usuario.setRol(rolCliente);
        usuario.setEstado(true);
        usuario.setEmailVerificado(false);

        // El hashing: la contraseña que escribió el usuario nunca se guarda, solo su hash BCrypt.
        usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        asignarNuevoCodigo(usuario);
        Usuario guardado = usuarioRepository.save(usuario);
        emailService.enviarCodigoVerificacion(guardado.getEmail(), guardado.getCodigoVerificacion());
        return guardado;
    }

    public Usuario login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new IllegalArgumentException("Correo o contraseña incorrectos."));

        // No se "desencripta" el hash (es imposible por diseño) — se aplica el mismo algoritmo a
        // lo que escribió el usuario y se compara contra el hash guardado.
        if (!passwordEncoder.matches(request.getPassword(), usuario.getPasswordHash())) {
            throw new IllegalArgumentException("Correo o contraseña incorrectos.");
        }
        if (!Boolean.TRUE.equals(usuario.getEmailVerificado())) {
            throw new IllegalArgumentException(MSG_CUENTA_NO_VERIFICADA);
        }

        return usuario;
    }

    public Usuario verificarEmail(String email, String codigo) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("No existe una cuenta con ese correo."));
        validarCodigo(usuario, codigo);

        usuario.setEmailVerificado(true);
        limpiarCodigo(usuario);
        return usuarioRepository.save(usuario);
    }

    public void reenviarCodigoVerificacion(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("No existe una cuenta con ese correo."));
        if (Boolean.TRUE.equals(usuario.getEmailVerificado())) {
            throw new IllegalArgumentException("Esta cuenta ya está verificada.");
        }
        asignarNuevoCodigo(usuario);
        usuarioRepository.save(usuario);
        emailService.enviarCodigoVerificacion(usuario.getEmail(), usuario.getCodigoVerificacion());
    }

    public void solicitarRecuperacion(String email) {
        // Mismo criterio que ya tenía el mock: si el correo no existe, se le dice explícitamente
        // (no se oculta la existencia de la cuenta) - coherente con que el propio registro ya
        // revela lo mismo con existsByEmail().
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("Este correo no está registrado."));
        asignarNuevoCodigo(usuario);
        usuarioRepository.save(usuario);
        emailService.enviarCodigoRecuperacion(usuario.getEmail(), usuario.getCodigoVerificacion());
    }

    public void verificarCodigoRecuperacion(String email, String codigo) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("No existe una cuenta con ese correo."));
        validarCodigo(usuario, codigo);
        // No se consume aquí a propósito - solo confirma para que la UI avance de paso;
        // nuevaPassword() vuelve a validar y ahí sí lo consume.
    }

    public void nuevaPassword(NuevaPasswordRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new IllegalArgumentException("No existe una cuenta con ese correo."));
        validarCodigo(usuario, request.getCodigo());

        usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        limpiarCodigo(usuario);
        usuarioRepository.save(usuario);
    }

    // Sin límite de intentos, un código de 6 dígitos (1.000.000 de combinaciones) es adivinable
    // por fuerza bruta dentro de los 15 minutos que dura vigente - más grave en recuperación de
    // contraseña, donde adivinarlo permite tomar control de una cuenta ajena sin saber su clave.
    private void validarCodigo(Usuario usuario, String codigo) {
        int intentos = usuario.getIntentosCodigo() != null ? usuario.getIntentosCodigo() : 0;
        if (intentos >= MAX_INTENTOS_CODIGO) {
            throw new IllegalArgumentException("Superaste el número de intentos permitidos. Solicita un código nuevo.");
        }
        if (usuario.getCodigoVerificacion() == null || usuario.getCodigoExpiracion() == null
            || !usuario.getCodigoVerificacion().equals(codigo)) {
            usuario.setIntentosCodigo(intentos + 1);
            usuarioRepository.save(usuario);
            throw new IllegalArgumentException("El código ingresado no es válido.");
        }
        if (LocalDateTime.now().isAfter(usuario.getCodigoExpiracion())) {
            throw new IllegalArgumentException("El código ya venció, solicita uno nuevo.");
        }
    }

    private void asignarNuevoCodigo(Usuario usuario) {
        usuario.setCodigoVerificacion(String.format("%06d", secureRandom.nextInt(1_000_000)));
        usuario.setCodigoExpiracion(LocalDateTime.now().plusMinutes(VIGENCIA_CODIGO_MINUTOS));
        usuario.setIntentosCodigo(0);
    }

    private void limpiarCodigo(Usuario usuario) {
        usuario.setCodigoVerificacion(null);
        usuario.setCodigoExpiracion(null);
        usuario.setIntentosCodigo(0);
    }
}

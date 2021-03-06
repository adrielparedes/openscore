package io.semantic.openscore.core.mapping;

import io.semantic.openscore.core.api.admin.UsuarioCompletoDTO;
import io.semantic.openscore.core.api.usuarios.CrearUsuarioDTO;
import io.semantic.openscore.core.api.usuarios.UpdateUsuarioDTO;
import io.semantic.openscore.core.api.usuarios.UsuarioDTO;
import io.semantic.openscore.core.model.Usuario;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mappings;

import java.util.List;

@Mapper(componentModel = "cdi")
public interface UsuarioMapper {

    Usuario asUsuario(UsuarioDTO api);

    @Mappings({
            @Mapping(source = "pais", target = "pais", ignore = true)
    })
    Usuario asUsuario(CrearUsuarioDTO crearUsuario);

    @Mappings({
            @Mapping(source = "pais", target = "pais", ignore = true),
    })
    void updateUsuario(UpdateUsuarioDTO usuarioDTO, @MappingTarget Usuario car);

    UsuarioDTO asApi(Usuario usuario);

    List<UsuarioDTO> asApi(List<Usuario> usuario);

    List<UsuarioCompletoDTO> asCompletoApi(List<Usuario> usuario);

    UsuarioCompletoDTO asCompletoApi(Usuario usuario);
}

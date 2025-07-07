class Api::V1::ServersController < Api::V1::BaseController
  before_action :authenticate_user!
  before_action :set_server, only: [:show, :update, :destroy]
  before_action :check_ownership, only: [:update, :destroy]
  
  # GET /api/v1/servers - Mis servidores
  def index
    servers = current_profile.servers.includes(:profile, :members)
    render_success(
      servers.map { |server| server_with_details(server) }
    )
  end
  
  # GET /api/v1/servers/:id - Detalles de un servidor
  def show
    render_success(server_with_details(@server))
  end
  
  # POST /api/v1/servers - Crear servidor
  def create
    server = current_profile.owned_servers.build(server_params)
    
    if server.save
      render_success(
        server_with_details(server),
        'Servidor creado exitosamente',
        :created
      )
    else
      render_error(server.errors.full_messages.join(', '))
    end
  end
  
  # PUT /api/v1/servers/:id - Actualizar servidor
  def update
    if @server.update(server_params)
      render_success(
        server_with_details(@server),
        'Servidor actualizado exitosamente'
      )
    else
      render_error(@server.errors.full_messages.join(', '))
    end
  end
  
  # DELETE /api/v1/servers/:id - Eliminar servidor
  def destroy
    @server.destroy
    render_success(nil, 'Servidor eliminado exitosamente')
  end
  
  # POST /api/v1/servers/join - Unirse a servidor con invite_code
  def join
    server = Server.find_by(invite_code: params[:invite_code])
    
    if server.nil?
      return render_error('Código de invitación inválido', :not_found)
    end
    
    # Verificar si ya es miembro
    existing_member = server.members.find_by(profile: current_profile)
    if existing_member
      return render_error('Ya eres miembro de este servidor', :unprocessable_entity)
    end
    
    # Agregar como miembro
    member = server.add_member(current_profile, 'GUEST')
    
    if member.persisted?
      render_success(
        server_with_details(server),
        'Te has unido al servidor exitosamente'
      )
    else
      render_error(member.errors.full_messages.join(', '))
    end
  end
  
  private
  
  def set_server
    @server = current_profile.servers.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render_error('Servidor no encontrado', :not_found)
  end
  
  def check_ownership
    unless @server.is_owner?(current_profile)
      render_error('No tienes permisos para realizar esta acción', :forbidden)
    end
  end
  
  def server_params
    params.require(:server).permit(:name, :description, :image_url)
  end
  
  def server_with_details(server)
    {
      id: server.id,
      name: server.name,
      description: server.description,
      image_url: server.image_url,
      invite_code: server.invite_code,
      owner: {
        id: server.profile.id,
        name: server.profile.name,
        image_url: server.profile.image_url
      },
      members_count: server.members.count,
      is_owner: server.is_owner?(current_profile),
      created_at: server.created_at,
      updated_at: server.updated_at
    }
  end
end

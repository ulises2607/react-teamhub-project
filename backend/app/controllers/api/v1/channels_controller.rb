class Api::V1::ChannelsController < Api::V1::BaseController
  before_action :authenticate_user!
  before_action :set_server
  before_action :check_membership
  before_action :set_channel, only: [:show, :update, :destroy]
  before_action :check_manage_permissions, only: [:create, :update, :destroy]
  
  # GET /api/v1/servers/:server_id/channels
  def index
    channels = @server.channels.includes(:profile).ordered_by_position
    render_success(
      channels.map { |channel| channel_data(channel) }
    )
  end
  
  # GET /api/v1/channels/:id
  def show
    render_success(channel_data(@channel))
  end
  
  # POST /api/v1/servers/:server_id/channels
  def create
    channel = @server.channels.build(channel_params)
    channel.profile = current_profile
    
    if channel.save
      render_success(
        channel_data(channel),
        'Canal creado exitosamente',
        :created
      )
    else
      render_error(channel.errors.full_messages.join(', '))
    end
  end
  
  # PUT /api/v1/channels/:id
  def update
    if @channel.update(channel_params.except(:channel_type)) # No permitir cambiar tipo
      render_success(
        channel_data(@channel),
        'Canal actualizado exitosamente'
      )
    else
      render_error(@channel.errors.full_messages.join(', '))
    end
  end
  
  # DELETE /api/v1/channels/:id
  def destroy
    if @channel.name == 'general'
      return render_error('No se puede eliminar el canal general', :forbidden)
    end
    
    @channel.destroy
    render_success(nil, 'Canal eliminado exitosamente')
  end
  
  private
  
  def set_server
    @server = current_profile.servers.find(params[:server_id])
  rescue ActiveRecord::RecordNotFound
    render_error('Servidor no encontrado', :not_found)
  end
  
  def set_channel
    if params[:server_id]
      @channel = @server.channels.find(params[:id])
    else
      # Para rutas directas a channels, verificar que el usuario es miembro
      @channel = Channel.find(params[:id])
      @server = @channel.server
      check_membership
    end
  rescue ActiveRecord::RecordNotFound
    render_error('Canal no encontrado', :not_found)
  end
  
  def check_membership
    unless @server.members.exists?(profile: current_profile)
      render_error('No eres miembro de este servidor', :forbidden)
    end
  end
  
  def check_manage_permissions
    member = @server.members.find_by(profile: current_profile)
    unless member&.can_manage_channels?
      render_error('No tienes permisos para gestionar canales', :forbidden)
    end
  end
  
  def channel_params
    params.require(:channel).permit(:name, :channel_type, :position)
  end
  
  def channel_data(channel)
    {
      id: channel.id,
      name: channel.name,
      channel_type: channel.channel_type,
      position: channel.position,
      server_id: channel.server_id,
      created_by: {
        id: channel.profile.id,
        name: channel.profile.name,
        image_url: channel.profile.image_url
      },
      messages_count: channel.messages.not_deleted.count,
      is_text_channel: channel.text_channel?,
      is_voice_channel: channel.voice_channel?,
      created_at: channel.created_at,
      updated_at: channel.updated_at
    }
  end
end

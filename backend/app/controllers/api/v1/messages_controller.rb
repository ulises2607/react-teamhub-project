class Api::V1::MessagesController < Api::V1::BaseController
  before_action :authenticate_user!
  before_action :set_channel
  before_action :check_membership
  before_action :set_message, only: [:show, :update, :destroy]
  before_action :check_message_permissions, only: [:update, :destroy]
  
  # GET /api/v1/channels/:channel_id/messages
  def index
    messages = @channel.messages
                      .not_deleted
                      .includes(member: :profile)
                      .recent
                      .limit(50) # Paginación básica
    
    render_success(
      messages.reverse.map { |message| message_data(message) }
    )
  end
  
  # GET /api/v1/messages/:id
  def show
    render_success(message_data(@message))
  end
  
  # POST /api/v1/channels/:channel_id/messages
  def create
    # Solo canales de texto permiten mensajes por ahora
    unless @channel.text_channel?
      return render_error('Solo se pueden enviar mensajes a canales de texto', :forbidden)
    end
    
    message = @channel.messages.build(message_params)
    message.member = current_member
    
    if message.save
      render_success(
        message_data(message),
        'Mensaje enviado exitosamente',
        :created
      )
    else
      render_error(message.errors.full_messages.join(', '))
    end
  end
  
  # PUT /api/v1/messages/:id
  def update
    if @message.edit!(params[:content])
      render_success(
        message_data(@message),
        'Mensaje editado exitosamente'
      )
    else
      render_error(@message.errors.full_messages.join(', '))
    end
  end
  
  # DELETE /api/v1/messages/:id
  def destroy
    @message.soft_delete!
    render_success(nil, 'Mensaje eliminado exitosamente')
  end
  
  private
  
  def set_channel
    @channel = Channel.find(params[:channel_id])
    @server = @channel.server
  rescue ActiveRecord::RecordNotFound
    render_error('Canal no encontrado', :not_found)
  end
  
  def set_message
    if params[:channel_id]
      @message = @channel.messages.find(params[:id])
    else
      @message = Message.find(params[:id])
      @channel = @message.channel
      @server = @channel.server
      check_membership
    end
  rescue ActiveRecord::RecordNotFound
    render_error('Mensaje no encontrado', :not_found)
  end
  
  def check_membership
    unless @server.members.exists?(profile: current_profile)
      render_error('No eres miembro de este servidor', :forbidden)
    end
  end
  
  def check_message_permissions
    unless @message.can_edit?(current_member) || @message.can_delete?(current_member)
      render_error('No tienes permisos para modificar este mensaje', :forbidden)
    end
  end
  
  def current_member
    @current_member ||= @server.members.find_by(profile: current_profile)
  end
  
  def message_params
    params.require(:message).permit(:content, :file_url)
  end
  
  def message_data(message)
    {
      id: message.id,
      content: message.content,
      file_url: message.file_url,
      deleted: message.deleted,
      edited_at: message.edited_at,
      is_edited: message.edited?,
      author: {
        id: message.profile.id,
        name: message.profile.name,
        image_url: message.profile.image_url,
        role: message.member.role
      },
      channel_id: message.channel_id,
      can_edit: message.can_edit?(current_member),
      can_delete: message.can_delete?(current_member),
      created_at: message.created_at,
      updated_at: message.updated_at
    }
  end
end

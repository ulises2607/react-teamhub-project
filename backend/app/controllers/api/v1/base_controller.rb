class Api::V1::BaseController < ApplicationController
  # No aplicamos authenticate_user! por defecto, cada controlador decidirá
  
  respond_to :json
  
  private
  
  def current_profile
    @current_profile ||= current_user&.profile
  end
  
  def render_error(message, status = :unprocessable_entity)
    render json: { error: message }, status: status
  end
  
  def render_success(data, message = nil, status = :ok)
    response = { data: data }
    response[:message] = message if message
    render json: response, status: status
  end
end

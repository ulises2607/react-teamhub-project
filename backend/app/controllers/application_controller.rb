class ApplicationController < ActionController::API
  respond_to :json

  protected

  def authenticate_user!
    # Obtener header Authorization
    header = request.headers['Authorization']
    # Extraer solo el token (sin "Bearer ")
    header = header.split(' ').last if header

    begin
      # Decodificar el token JWT
      @decoded = JsonWebToken.decode(header)
      # Buscar el usuario por el ID del token
      @current_user = User.find(@decoded[:user_id])
    rescue ActiveRecord::RecordNotFound => e
      render json: {errors: e.message }, status: :unauthorized
    rescue JWT::DecodeError => e
      render json: {errors: e.message }, status: :unauthorized
    end
  end

  def current_user
    @current_user
  end
end

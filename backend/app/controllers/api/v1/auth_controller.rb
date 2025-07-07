class Api::V1::AuthController < Api::V1::BaseController
  before_action :authenticate_user!, except: [:login, :register]
  
  # POST /api/v1/register
  def register
    user = User.new(user_params)
    
    if user.save
      token = generate_jwt_token(user)
      render_success({
        user: UserSerializer.new(user).serializable_hash[:data][:attributes],
        token: token
      }, 'User created successfully', :created)
    else
      render_error(user.errors.full_messages.join(', '))
    end
  end
  
  # POST /api/v1/auth/login
  def login
    user = User.find_by(email: params[:email])
    
    if user&.valid_password?(params[:password])
      token = generate_jwt_token(user)
      render_success({
        user: UserSerializer.new(user).serializable_hash[:data][:attributes],
        token: token
      }, 'Login successful')
    else
      render_error('Invalid email or password', :unauthorized)
    end
  end
  
  # DELETE /api/v1/auth/logout
  def logout
    # Con JWT stateless, solo necesitamos confirmar el logout del lado del cliente
    render_success(nil, 'Logout successful')
  end
  
  # GET /api/v1/auth/me
  def me
    render_success({
      user: UserSerializer.new(current_user).serializable_hash[:data][:attributes],
      profile: ProfileSerializer.new(current_user.profile).serializable_hash[:data][:attributes]
    })
  end
  
  private
  
  def user_params
    params.require(:user).permit(:username, :email, :password, :password_confirmation)
  end
  
  def generate_jwt_token(user)
    payload = {
      user_id: user.id,
      username: user.username,
      exp: 24.hours.from_now.to_i
    }
    
    JWT.encode(payload, Rails.application.credentials.jwt_secret_key || 'your-secret-key-here')
  end
end

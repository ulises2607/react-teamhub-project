class Api::V1::AuthenticationController < Api::V1::BaseController
  skip_before_action :authenticate_user!, only: [:login, :signup]
  
  def signup
    user = User.new(user_params)
    
    if user.save
      token = generate_jwt_token(user)
      render_success(
        {
          user: UserSerializer.new(user).serializable_hash[:data][:attributes],
          token: token
        },
        'User created successfully',
        :created
      )
    else
      render_error(user.errors.full_messages.join(', '))
    end
  end
  
  def login
    user = User.find_by(email: params[:email])
    
    if user&.valid_password?(params[:password])
      token = generate_jwt_token(user)
      render_success(
        {
          user: UserSerializer.new(user).serializable_hash[:data][:attributes],
          token: token
        },
        'Login successful'
      )
    else
      render_error('Invalid credentials', :unauthorized)
    end
  end
  
  def logout
    # JWT tokens are stateless, so we just return success
    # In a production app, you might want to implement a blacklist
    render_success(nil, 'Logout successful')
  end
  
  def me
    if current_user
      render_success(
        UserSerializer.new(current_user).serializable_hash[:data][:attributes]
      )
    else
      render_error('User not found', :unauthorized)
    end
  end
  
  private
  
  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation, :username)
  end
  
  def generate_jwt_token(user)
    JWT.encode(
      {
        user_id: user.id,
        exp: 24.hours.from_now.to_i
      },
      Rails.application.credentials.jwt_secret_key || 'your-secret-key-here'
    )
  end
end

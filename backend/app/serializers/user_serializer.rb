class UserSerializer
  include JSONAPI::Serializer
  
  attributes :id, :email, :username, :display_name, :avatar_url, :bio, :status, :created_at
end
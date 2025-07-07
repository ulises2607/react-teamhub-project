class UserSerializer
  include JSONAPI::Serializer
  
  attributes :id, :email, :username, :created_at, :updated_at
  
  has_one :profile, serializer: ProfileSerializer
end

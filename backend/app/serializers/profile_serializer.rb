class ProfileSerializer
  include JSONAPI::Serializer
  
  attributes :id, :name, :image_url, :created_at, :updated_at
  
  belongs_to :user, serializer: UserSerializer
end

class ServerSerializer
  include JSONAPI::Serializer
  
  attributes :id, :name, :description, :image_url, :invite_code, :created_at, :updated_at
  
  belongs_to :profile, serializer: ProfileSerializer
  has_many :members, serializer: MemberSerializer
  has_many :channels, serializer: ChannelSerializer
  
  attribute :members_count do |server|
    server.members.count
  end
  
  attribute :channels_count do |server|
    server.channels.count
  end
  
  attribute :is_owner do |server, params|
    current_profile = params[:current_profile]
    current_profile && server.is_owner?(current_profile)
  end
end

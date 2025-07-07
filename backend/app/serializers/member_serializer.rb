class MemberSerializer
  include JSONAPI::Serializer
  
  attributes :id, :role, :created_at, :updated_at
  
  belongs_to :profile, serializer: ProfileSerializer
  belongs_to :server, serializer: ServerSerializer
  
  attribute :permissions do |member|
    {
      can_manage_server: member.can_manage_server?,
      can_manage_channels: member.can_manage_channels?,
      can_kick_members: member.can_kick_members?,
      is_admin: member.admin?,
      is_moderator: member.moderator?
    }
  end
end

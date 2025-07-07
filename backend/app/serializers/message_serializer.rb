class MessageSerializer
  include JSONAPI::Serializer
  
  attributes :id, :content, :file_url, :deleted, :edited_at, :created_at, :updated_at
  
  belongs_to :member, serializer: MemberSerializer
  belongs_to :channel, serializer: ChannelSerializer
  
  attribute :author do |message|
    {
      id: message.profile.id,
      name: message.profile.name,
      image_url: message.profile.image_url,
      role: message.member.role
    }
  end
  
  attribute :is_edited do |message|
    message.edited?
  end
  
  attribute :can_edit do |message, params|
    current_member = params[:current_member]
    current_member && message.can_edit?(current_member)
  end
  
  attribute :can_delete do |message, params|
    current_member = params[:current_member]
    current_member && message.can_delete?(current_member)
  end
end

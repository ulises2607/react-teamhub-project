class ChannelSerializer
  include JSONAPI::Serializer
  
  attributes :id, :name, :channel_type, :position, :created_at, :updated_at
  
  belongs_to :server, serializer: ServerSerializer
  belongs_to :profile, serializer: ProfileSerializer
  
  attribute :messages_count do |channel|
    channel.messages.not_deleted.count
  end
  
  attribute :is_text_channel do |channel|
    channel.text_channel?
  end
  
  attribute :is_voice_channel do |channel|
    channel.voice_channel?
  end
end

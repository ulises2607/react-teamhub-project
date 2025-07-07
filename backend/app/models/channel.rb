class Channel < ApplicationRecord
  belongs_to :server
  belongs_to :profile # Creador del canal
  
  # Associations
  has_many :messages, dependent: :destroy
  
  # Tipos de canal
  CHANNEL_TYPES = %w[TEXT VOICE].freeze
  
  # Validations
  validates :name, presence: true, length: { minimum: 1, maximum: 50 }
  validates :name, uniqueness: { scope: :server_id, message: "Ya existe un canal con ese nombre en este servidor" }
  validates :name, format: { with: /\A[a-z0-9\-_]+\z/, message: "Solo puede contener letras minúsculas, números, guiones y guiones bajos" }
  validates :channel_type, presence: true, inclusion: { in: CHANNEL_TYPES }
  validates :position, presence: true, numericality: { greater_than_or_equal_to: 0 }
  
  # Callbacks
  before_validation :normalize_name
  before_create :set_position
  
  # Scopes
  scope :text_channels, -> { where(channel_type: 'TEXT') }
  scope :voice_channels, -> { where(channel_type: 'VOICE') }
  scope :ordered_by_position, -> { order(:position, :created_at) }
  
  # Methods
  def text_channel?
    channel_type == 'TEXT'
  end
  
  def voice_channel?
    channel_type == 'VOICE'
  end
  
  private
  
  def normalize_name
    self.name = name&.downcase&.strip&.gsub(/[^a-z0-9\-_]/, '-')&.gsub(/-+/, '-')&.gsub(/^-|-$/, '')
  end
  
  def set_position
    max_position = server.channels.maximum(:position) || -1
    self.position = max_position + 1
  end
end

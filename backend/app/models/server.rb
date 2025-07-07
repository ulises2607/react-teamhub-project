class Server < ApplicationRecord
  belongs_to :profile # Owner del servidor
  
  # Validations
  validates :name, presence: true, length: { minimum: 1, maximum: 50 }
  validates :invite_code, presence: true, uniqueness: true, length: { is: 6 }
  validates :description, length: { maximum: 500 }, allow_blank: true
  
  # Associations
  has_many :members, dependent: :destroy
  has_many :profiles, through: :members
  has_many :channels, dependent: :destroy
  
  # Callbacks
  before_validation :generate_invite_code, on: :create
  after_create :create_owner_membership
  after_create :create_default_channels
  
  # Scopes
  scope :public_servers, -> { where.not(invite_code: nil) }
  
  # Methods
  def owner
    profile
  end
  
  def is_owner?(profile)
    self.profile == profile
  end
  
  def add_member(profile, role = 'GUEST')
    members.create!(profile: profile, role: role)
  end
  
  private
  
  def generate_invite_code
    self.invite_code = SecureRandom.alphanumeric(6).upcase until invite_code && !Server.exists?(invite_code: invite_code)
  end
  
  def create_owner_membership
    # El owner automáticamente se convierte en ADMIN del servidor
    add_member(profile, 'ADMIN')
  end
  
  def create_default_channels
    # Crear canal general por defecto
    channels.create!(
      name: 'general',
      channel_type: 'TEXT',
      profile: profile,
      position: 0
    )
  end
end

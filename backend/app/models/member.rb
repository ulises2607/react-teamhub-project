class Member < ApplicationRecord
  belongs_to :profile
  belongs_to :server
  
  # Associations
  has_many :messages, dependent: :destroy
  
  # Enums para roles
  ROLES = %w[ADMIN MODERATOR GUEST].freeze
  
  # Validations
  validates :role, presence: true, inclusion: { in: ROLES }
  validates :profile_id, uniqueness: { scope: :server_id, message: "Ya es miembro de este servidor" }
  
  # Scopes
  scope :admins, -> { where(role: 'ADMIN') }
  scope :moderators, -> { where(role: 'MODERATOR') }
  scope :guests, -> { where(role: 'GUEST') }
  
  # Methods
  def admin?
    role == 'ADMIN'
  end
  
  def moderator?
    role == 'MODERATOR'
  end
  
  def can_manage_server?
    admin?
  end
  
  def can_manage_channels?
    admin? || moderator?
  end
  
  def can_kick_members?
    admin? || moderator?
  end
end

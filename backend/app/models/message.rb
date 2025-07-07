class Message < ApplicationRecord
  belongs_to :member
  belongs_to :channel
  
  # Delegations para facilitar el acceso
  delegate :profile, to: :member
  delegate :server, to: :channel
  
  # Validations
  validates :content, presence: true, unless: :has_file?
  validates :content, length: { maximum: 2000 }, allow_blank: true
  validate :content_or_file_present
  
  # Scopes
  scope :not_deleted, -> { where(deleted: false) }
  scope :recent, -> { order(created_at: :desc) }
  scope :chronological, -> { order(created_at: :asc) }
  
  # Methods
  def soft_delete!
    update!(deleted: true)
  end
  
  def edit!(new_content)
    update!(content: new_content, edited_at: Time.current)
  end
  
  def edited?
    edited_at.present?
  end
  
  def has_file?
    file_url.present?
  end
  
  def can_edit?(current_member)
    member == current_member && !deleted?
  end
  
  def can_delete?(current_member)
    # El autor puede eliminar, o un admin/moderador del servidor
    member == current_member || current_member&.can_manage_channels?
  end
  
  private
  
  def content_or_file_present
    if content.blank? && file_url.blank?
      errors.add(:base, "El mensaje debe tener contenido o un archivo")
    end
  end
end

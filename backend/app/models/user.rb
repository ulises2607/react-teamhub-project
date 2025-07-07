class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :trackable, :jwt_authenticatable,
        jwt_revocation_strategy: self

  # Validations
  validates :username, presence: true, uniqueness: {case_sensitive: false}
  validates :username, length: { minimum: 3, maximum: 20 }
  validates :username, format: { with: /\A[a-zA-Z0-9_]+\z/, message: "only allows letters, numbers, and underscores" }

  # Enums
  enum :status, { online: 0, away: 1, busy: 2, invisible: 3 }

  # Callbacks

  before_create :set_default_display_name

  private

  def set_default_display_name
    self.display_name = username if display_name.blank?
  end

end

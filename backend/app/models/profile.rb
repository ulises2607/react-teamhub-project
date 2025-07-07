class Profile < ApplicationRecord
  belongs_to :user
  
  # Validations
  validates :name, presence: true, length: { minimum: 1, maximum: 50 }
  validates :user_id, presence: true, uniqueness: true
  
  # Associations
  has_many :owned_servers, class_name: 'Server', dependent: :destroy
  has_many :members, dependent: :destroy
  has_many :servers, through: :members
  # has_many :messages, through: :members (will add when we create Message model)
end

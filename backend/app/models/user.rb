class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: Devise::JWT::RevocationStrategies::Null
  
  # Validations
  validates :username, presence: true, uniqueness: true, length: { minimum: 3, maximum: 20 }
  validates :email, presence: true, uniqueness: true
  
  # Associations
  has_one :profile, dependent: :destroy
  has_many :members, through: :profile
  has_many :servers, through: :members
  
  # Callbacks
  after_create :create_profile
  
  private
  
  def create_profile
    Profile.create!(
      user: self,
      name: self.username,
      image_url: nil
    )
  end
end

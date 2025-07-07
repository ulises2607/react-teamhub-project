Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # Health check
      get 'health', to: 'health#check'
      
      # Autenticación con Devise
      devise_for :users, path: 'auth', controllers: {
        sessions: 'api/v1/auth/sessions',
        registrations: 'api/v1/auth/registrations'
      }
      
      # Usuario actual (protegido)
      get 'auth/me', to: 'users#show'
    end
  end
  
  mount ActionCable.server => '/cable'
end
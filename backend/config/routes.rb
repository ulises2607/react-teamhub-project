Rails.application.routes.draw do
  # Devise routes (can be customized later)
  devise_for :users, skip: [:sessions, :registrations]
  
  # API routes
  namespace :api do
    namespace :v1 do
      # Authentication routes
      post '/register', to: 'auth#register'
      post '/login', to: 'auth#login'
      delete '/logout', to: 'auth#logout'
      get '/me', to: 'auth#me'
      
      # Servers routes
      resources :servers, except: [:new, :edit] do
        collection do
          post :join
        end
        
        # Nested routes for channels within servers
        resources :channels, except: [:new, :edit] do
          # Nested routes for messages within channels
          resources :messages, except: [:new, :edit, :show]
        end
      end
      
      # Direct access to channels and messages (for cases where we might need them)
      resources :channels, only: [:show, :update, :destroy]
      resources :messages, only: [:show, :update, :destroy]
      
      # Future routes for other resources
      # resources :profiles, only: [:show, :update]
    end
  end
  
  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get "users/show"
      namespace :auth do
        get "registrations/create"
        get "sessions/create"
        get "sessions/destroy"
      end
    end
  end
  devise_for :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

 namespace :api do
    namespace :v1 do
      # Health check endpoint
      get 'health', to: 'health#check'
    end
  end

  # Websockets para tiempo real
  mount ActionCable.server => '/cable'
end

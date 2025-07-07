Rails.application.routes.draw do
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

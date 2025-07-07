class Api::V1::HealthController < ApplicationController

  def check
    render json: {
      status: 'ok',
      message: 'TeamHub Backend API is running!',
      timestamp: Time.current,
      version: '1.0.0'
    }
  end
end
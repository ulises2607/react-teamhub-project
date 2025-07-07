require 'rails_helper'

RSpec.describe "Api::V1::Auth::Sessions", type: :request do
  describe "GET /create" do
    it "returns http success" do
      get "/api/v1/auth/sessions/create"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /destroy" do
    it "returns http success" do
      get "/api/v1/auth/sessions/destroy"
      expect(response).to have_http_status(:success)
    end
  end

end

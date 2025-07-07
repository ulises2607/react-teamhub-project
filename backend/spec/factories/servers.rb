FactoryBot.define do
  factory :server do
    name { "MyString" }
    description { "MyText" }
    image_url { "MyString" }
    invite_code { "MyString" }
    profile { nil }
  end
end

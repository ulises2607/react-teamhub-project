FactoryBot.define do
  factory :message do
    content { "MyText" }
    file_url { "MyString" }
    member { nil }
    channel { nil }
    deleted { false }
  end
end

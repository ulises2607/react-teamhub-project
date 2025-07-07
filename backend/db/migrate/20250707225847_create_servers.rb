class CreateServers < ActiveRecord::Migration[8.0]
  def change
    create_table :servers do |t|
      t.string :name, null: false
      t.text :description
      t.string :image_url
      t.string :invite_code, null: false
      t.references :profile, null: false, foreign_key: true

      t.timestamps
    end
    
    add_index :servers, :invite_code, unique: true
  end
end

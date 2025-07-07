class CreateMessages < ActiveRecord::Migration[8.0]
  def change
    create_table :messages do |t|
      t.text :content
      t.string :file_url
      t.references :member, null: false, foreign_key: true
      t.references :channel, null: false, foreign_key: true
      t.boolean :deleted, default: false, null: false
      t.datetime :edited_at

      t.timestamps
    end
    
    add_index :messages, [:channel_id, :created_at]
  end
end

class CreateChannels < ActiveRecord::Migration[8.0]
  def change
    create_table :channels do |t|
      t.string :name, null: false
      t.string :channel_type, null: false, default: 'TEXT'
      t.integer :position, default: 0
      t.references :server, null: false, foreign_key: true
      t.references :profile, null: false, foreign_key: true

      t.timestamps
    end
    
    add_index :channels, [:server_id, :name], unique: true
    add_index :channels, [:server_id, :position]
  end
end

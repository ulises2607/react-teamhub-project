class CreateMembers < ActiveRecord::Migration[8.0]
  def change
    create_table :members do |t|
      t.references :profile, null: false, foreign_key: true
      t.references :server, null: false, foreign_key: true
      t.string :role, null: false, default: 'GUEST'

      t.timestamps
    end
    
    # Un profile solo puede ser miembro una vez por servidor
    add_index :members, [:profile_id, :server_id], unique: true
  end
end

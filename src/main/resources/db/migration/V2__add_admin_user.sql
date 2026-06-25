-- Adicionando conta admin
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'teste@admin.com') THEN
        INSERT INTO users (id, email, password, name, role) 
        VALUES (nextval('users_seq'), 'teste@admin.com', '123456', 'admin', 'admin');
    ELSE
        UPDATE users SET password = 'admin' WHERE email = 'teste@admin.com';
    END IF;
END $$;

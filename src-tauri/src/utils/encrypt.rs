fn xor_encrypt(data: &str, key: u8) -> String {
    data.as_bytes()
        .iter()
        .map(|&byte| byte ^ key) // XOR each byte with the key
        .map(|byte| format!("{:02x}", byte)) // Convert to hex
        .collect::<Vec<String>>()
        .join("")
}

// XOR decryption function (convert hex string back to original data)
fn xor_decrypt(encrypted_hex: &str, key: u8) -> String {
    let decrypted_bytes: Vec<u8> = (0..encrypted_hex.len())
        .step_by(2)
        .map(|i| u8::from_str_radix(&encrypted_hex[i..i + 2], 16).unwrap() ^ key) // Convert hex to bytes & XOR
        .collect();

    String::from_utf8(decrypted_bytes).unwrap()
}

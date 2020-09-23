disable_mlock = true
ui = true

listener "tcp" {
  tls_disable = 1
  address = "[::]:8200"
}

storage "file" {
  path = "/vault/file"
}

variable "do_token" {}
variable "droplet_ssh_key_id" {}
variable "droplet_name" {}
variable "droplet_size" {}
variable "droplet_region" {}

# Configure the DigitalOcean Provider
provider "digitalocean" {
  token = var.do_token
}


# Get snapshot name
data "digitalocean_droplet_snapshot" "centos8-nginxforblog-image" {
  name_regex  = "^image-by-packer-centos8-nginxforblog"
  region      = "nyc1"
  most_recent = true
}

# Create a web server
resource "digitalocean_droplet" "blog-server-by-terrraform" {
  image      = "${data.digitalocean_droplet_snapshot.centos8-nginxforblog-image.id}"
  name       = var.droplet_name
  region     = var.droplet_region
  size       = var.droplet_size
  monitoring = "true"
  ssh_keys   = [var.droplet_ssh_key_id]
}

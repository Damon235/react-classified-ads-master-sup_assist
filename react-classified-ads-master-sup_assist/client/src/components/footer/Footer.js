import React from "react";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaPhone,
} from "react-icons/fa"; // Import the required icons

export default function Footer() {
  return (
    <div className="footer">
      <div className="footer-text">
        made with &#10084; by{" "}
        <a href="https://www.harshavarthan/" target="_blank" rel="noreferrer">
          harsha
        </a>
      </div>
      <div className="social-icon">
        <ul>
          <li>
            <a href="mailto:#" target="_blank" rel="noreferrer">
              <FaEnvelope />
            </a>
          </li>
          <li>
            <a href="https://api.whatsapp.com/send?phone=2348117245997&text=Hello" target="_blank" rel="noreferrer">
              <FaWhatsapp />
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/newlevels.co" target="_blank" rel="noreferrer">
              <FaInstagram />
            </a>
          </li>
          <li>
            <a href="https://www.facebook.com/profile.php?id=100092301401013" target="_blank" rel="noreferrer">
              <FaFacebook />
            </a>
          </li>
          <li>
            <a href="https://www.twitter.com/Newlevelsscotty" target="_blank" rel="noreferrer">
              <FaTwitter />
            </a>
          </li>
          <li>
            <a href="tel:08117246049">
              <FaPhone />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

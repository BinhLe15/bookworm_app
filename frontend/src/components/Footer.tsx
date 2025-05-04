import logo from "../assets/bookworm-logo.png";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 px-6">
      <div className="container mx-auto flex flex-row items-center">
        <img src={logo} alt="Logo" className="h-16 w-16 inline-block mr-2" />
        <div>
          <p>BOOKWORM</p>
          <p className="text-sm">Address</p>
          <p className="text-sm">Phone</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

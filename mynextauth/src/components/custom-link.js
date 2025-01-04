import Link from "next/link";

const CustomLink = ({ href, children, className, ...props }) => {
  return (
    <Link href={href} passHref>
        {children}
      
    </Link>
  );
};

export default CustomLink;

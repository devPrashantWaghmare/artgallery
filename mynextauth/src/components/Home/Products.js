import Link from 'next/link';
import Image from 'next/image';
import '../../styles/Products.css';

const Products = () => {
  const images = [
    '/artworks/image1.png',
    '/artworks/image2.png',
    '/artworks/image3.png',
    '/artworks/image4.png',
    '/artworks/image5.png',
    '/artworks/image6.png',
    '/artworks/image7.png',
    '/artworks/image8.png',
    '/artworks/image9.png',
    'https://www.bing.com/images/search?view=detailV2&ccid=%2fQcmP%2fzw&id=7B50D7F7E551432CDF02B358246A1E709FB385EA&thid=OIP._QcmP_zwW77pGoRbvMn8vgHaFl&mediaurl=https%3a%2f%2fi.etsystatic.com%2f8477566%2fr%2fil%2fe6c80e%2f2366255663%2fil_fullxfull.2366255663_25sw.jpg&exph=1580&expw=2092&q=paintings&simid=608028367747508173&FORM=IRPRST&ck=4D693658EFEC5B6A4B1F705FEF0CD336&selectedIndex=8&itb=0',
    'https://th.bing.com/th/id/OIP.LBZ3qf-j_ZUInOwaSra0uAHaNk?w=236&h=432&c=7&o=5&pid=1.20',
  ];

  return (
    <section className="products py-20">
      <h2 className="text-3xl text-center font-bold">Featured Artworks</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {images.map((imagePath, index) => (
          <Link key={index} href={`/products/${index + 1}`}>
            <div>
              <img
                src={imagePath} // Use the relative path
                alt={`Artwork ${index + 1}`}
                className="w-full h-48 object-cover rounded"
                width={600}
                height={400} // Specify dimensions for next/image
              />
              <h3 className="mt-4 text-lg font-bold">Artwork {index + 1}</h3>
              <p className="text-gray-600">$200</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Products;

import Head from "next/head";
interface takenProps {
  HTMLTitle: string;
  Title: string;
  Description: string;
  Image?: {
    URL: string;
    Height?: string;
    Width?: string;
  };
  BlockIndex?: boolean;
}
const CustomHead: React.FC<takenProps> = ({ HTMLTitle, Title, Description, Image, BlockIndex }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="locale" content="en_US" />
        <meta name="theme-color" content="#222630" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <meta property="og:title" content={Title} />
        <meta property="og:site_name" content="HD22" />
        <meta name="description" content={Description} />
        <meta property="og:description" content={Description} />
        <meta property="og:type" content="website" />
        {Image && (
          <>
            <meta property="og:image" content={Image.URL} />
            {Image.Width ? <meta property="og:image:width" content={Image.Width} /> : <></>}
            {Image.Height ? <meta property="og:image:height" content={Image.Height} /> : <></>}
            <meta property="og:image:type" content={Image.URL} />
            <meta property="twitter:image" content={Image.URL} />
          </>
        )}
        {BlockIndex && <meta name="robots" content="noindex" />}
        <meta name="twitter-card" content="summary_large_image" />
        {/* <meta name="twitter:site" content="@" /> */}
        {/* <meta name="twitter:creator" content="@" /> */}
        <meta name="twitter:title" content={Title} />
        <meta name="twitter:description" content={Description} />
        <title>{HTMLTitle}</title>
      </Head>
    </>
  );
};
export default CustomHead;

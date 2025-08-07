export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-16">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-600">
          Desenvolvido por{' '}
          <a
            href="https://jrcristofani.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
          >
            José Roberto Cristofani
          </a>
          . (siga @jrcristofani).
        </p>
      </div>
    </footer>
  );
}

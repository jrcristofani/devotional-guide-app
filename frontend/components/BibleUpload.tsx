import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import backend from '~backend/client';

export function BibleUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [bibleStatus, setBibleStatus] = useState<{ isAvailable: boolean; message: string } | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkBibleStatus();
  }, []);

  const checkBibleStatus = async () => {
    try {
      setIsCheckingStatus(true);
      const status = await backend.bible.checkBibleStatus();
      setBibleStatus(status);
      if (status.isAvailable) {
        setUploadSuccess(true);
      }
    } catch (error) {
      console.error('Error checking Bible status:', error);
      setBibleStatus({
        isAvailable: false,
        message: "Erro ao verificar status da Bíblia"
      });
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione um arquivo JSON.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Read file content
      const fileContent = await file.text();
      
      // Validate JSON structure for NVI format
      try {
        const jsonData = JSON.parse(fileContent);
        
        // Check if it's an array (NVI format)
        if (!Array.isArray(jsonData)) {
          throw new Error("Estrutura JSON inválida - deve ser um array");
        }
        
        // Check if first item has expected NVI structure
        if (jsonData.length > 0) {
          const firstBook = jsonData[0];
          if (!firstBook.name || !firstBook.abbrev || !Array.isArray(firstBook.chapters)) {
            throw new Error("Estrutura JSON inválida - formato NVI esperado");
          }
          
          // Check if chapters contain arrays of verses
          if (firstBook.chapters.length > 0 && !Array.isArray(firstBook.chapters[0])) {
            throw new Error("Estrutura JSON inválida - capítulos devem ser arrays de versículos");
          }
        }
      } catch (parseError) {
        toast({
          title: "Arquivo JSON inválido",
          description: "O arquivo não possui a estrutura esperada da Bíblia NVI. Formato esperado: [{'name': '...', 'abbrev': '...', 'chapters': [[...]]}]",
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }

      // Upload to backend
      const result = await backend.bible.uploadBible({ fileContent });
      
      if (result.success) {
        setUploadSuccess(true);
        setBibleStatus({
          isAvailable: true,
          message: result.message
        });
        toast({
          title: "Upload realizado com sucesso!",
          description: result.message,
        });
      } else {
        throw new Error("Upload failed");
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      
      let errorMessage = "Ocorreu um erro ao fazer upload do arquivo. Tente novamente.";
      
      if (error?.message) {
        if (error.message.includes("Invalid JSON")) {
          errorMessage = "Arquivo JSON inválido. Verifique a estrutura do arquivo.";
        } else if (error.message.includes("NVI format")) {
          errorMessage = "Formato NVI inválido. Verifique se o arquivo está no formato correto.";
        }
      }
      
      toast({
        title: "Erro no upload",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isCheckingStatus) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-gray-600">Verificando status da Bíblia...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Gerenciamento da Bíblia NVI
        </CardTitle>
        <CardDescription>
          {bibleStatus?.isAvailable 
            ? "A Bíblia NVI já está carregada e disponível para uso"
            : "Faça upload do arquivo nvi.json para usar os textos bíblicos da Nova Versão Internacional"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Display */}
        <div className={`p-4 rounded-lg border ${
          bibleStatus?.isAvailable 
            ? 'bg-green-50 border-green-200' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center gap-2">
            {bibleStatus?.isAvailable ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            )}
            <p className={`font-medium ${
              bibleStatus?.isAvailable ? 'text-green-800' : 'text-yellow-800'
            }`}>
              {bibleStatus?.message || "Status desconhecido"}
            </p>
          </div>
        </div>

        {!bibleStatus?.isAvailable && (
          <>
            <div className="space-y-2">
              <Label htmlFor="bible-file">Arquivo da Bíblia (nvi.json)</Label>
              <Input
                id="bible-file"
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Formato esperado do arquivo nvi.json:</h4>
              <div className="text-sm text-blue-700 space-y-2">
                <p>O arquivo deve ser um array de objetos com a seguinte estrutura:</p>
                <pre className="bg-white p-2 rounded text-xs overflow-x-auto">
{`[
  {
    "abbrev": "Gn",
    "name": "Gênesis", 
    "chapters": [
      ["No princípio...", "E a terra era..."],
      ["Assim foram acabados..."]
    ]
  },
  {
    "abbrev": "Êx",
    "name": "Êxodo",
    "chapters": [...]
  }
]`}
                </pre>
                <ul className="space-y-1">
                  <li>• Cada livro tem nome, abreviação e capítulos</li>
                  <li>• Cada capítulo é um array de strings (versículos)</li>
                  <li>• Os versículos são indexados automaticamente (1, 2, 3...)</li>
                </ul>
              </div>
            </div>

            {isUploading && (
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-700">Fazendo upload do arquivo...</p>
              </div>
            )}
          </>
        )}

        {bibleStatus?.isAvailable && (
          <div className="space-y-4">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Bíblia NVI Disponível!
              </h3>
              <p className="text-green-700">
                A Bíblia NVI está carregada e os devocionais incluirão os textos bíblicos completos automaticamente.
              </p>
            </div>

            <div className="text-center">
              <Button
                variant="outline"
                onClick={checkBibleStatus}
                disabled={isCheckingStatus}
              >
                Verificar Status Novamente
              </Button>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">ℹ️ Informação:</h4>
              <p className="text-sm text-blue-700">
                O arquivo da Bíblia fica armazenado permanentemente. Você só precisa fazer upload uma vez, 
                e ele estará disponível para todos os devocionais futuros.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

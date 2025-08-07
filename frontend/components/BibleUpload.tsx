import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Upload, FileText, CheckCircle } from 'lucide-react';

export function BibleUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { toast } = useToast();

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

      // Convert to blob and upload
      const blob = new Blob([fileContent], { type: 'application/json' });
      const buffer = await blob.arrayBuffer();
      
      // Here you would typically upload to your backend
      // For now, we'll simulate the upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploadSuccess(true);
      toast({
        title: "Upload realizado com sucesso!",
        description: "A Bíblia NVI foi carregada e está pronta para uso.",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Erro no upload",
        description: "Ocorreu um erro ao fazer upload do arquivo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Upload da Bíblia NVI
        </CardTitle>
        <CardDescription>
          Faça upload do arquivo nvi.json para usar os textos bíblicos da Nova Versão Internacional
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!uploadSuccess ? (
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
        ) : (
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Upload Concluído!
            </h3>
            <p className="text-green-700">
              A Bíblia NVI foi carregada com sucesso e agora os devocionais incluirão os textos bíblicos completos.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

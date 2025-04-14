"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { QRCodeSVG } from "qrcode.react"
import { Check, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
  clientName: z
    .string()
    .min(1, "Nome é obrigatório")
    .refine((value) => value.trim().includes(" "), {
      message: "Por favor, informe nome e sobrenome",
    }),
  clientPhone: z.string().min(1, "Telefone é obrigatório"),
  clientEmail: z.string().min(1, "Email é obrigatório").email("Email inválido"),
  agentName: z.string().min(1, "Selecione um corretor"),
  propertyInterest: z.string().min(1, "Informe o lote/quadra de interesse"),
  observations: z.string().optional(),
  confirmation: z.literal(true, {
    errorMap: () => ({
      message: "Você precisa confirmar esta declaração",
    }),
  }),
})

type FormValues = z.infer<typeof formSchema>

export default function LeadRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      clientName: "",
      clientPhone: "",
      clientEmail: "",
      agentName: "",
      propertyInterest: "",
      observations: "",
      confirmation: false,
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    try {
      // Integration with Make.com API
      const response = await fetch("https://hook.us2.make.com/a2bodn21dbv4ecftcz778twwohe2k9ao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Falha ao enviar dados")
      }

      setIsSubmitted(true)
      form.reset()
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "")

    // Format based on length
    if (digits.length <= 2) {
      return `(${digits}`
    } else if (digits.length <= 7) {
      return `(${digits.slice(0, 2)})${digits.slice(2)}`
    } else {
      return `(${digits.slice(0, 2)})${digits.slice(2, 7)}-${digits.slice(7, 11)}`
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Indicação de Cliente Lago Azul</h1>
      </div>

      {isSubmitted ? (
        <div className="rounded-lg bg-green-50 p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-2">
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-green-800">Indicação enviada com sucesso!</h3>
          <p className="mt-2 text-sm text-green-700">
            Obrigado por sua indicação. Nossa equipe entrará em contato em breve.
          </p>
          <Button className="mt-4" variant="outline" onClick={() => setIsSubmitted(false)}>
            Fazer nova indicação
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Cliente</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nome e sobrenome"
                      {...field}
                      className={`rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${
                        form.formState.errors.clientName ? "border-red-500" : ""
                      }`}
                      onBlur={(e) => {
                        field.onBlur()
                        form.trigger("clientName")
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clientPhone"
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Telefone/WhatsApp do Cliente</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(00)00000-0000"
                      {...field}
                      onChange={(e) => {
                        const formatted = formatPhoneNumber(e.target.value)
                        e.target.value = formatted
                        onChange(e)
                      }}
                      className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clientEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email do Cliente</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@exemplo.com"
                      {...field}
                      className={`rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${
                        form.formState.errors.clientEmail ? "border-red-500" : ""
                      }`}
                      onBlur={(e) => {
                        field.onBlur()
                        form.trigger("clientEmail")
                      }}
                      onChange={(e) => {
                        field.onChange(e)
                        if (e.target.value.includes("@")) {
                          form.trigger("clientEmail")
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Corretor</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      form.trigger("agentName")
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={`rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${
                          form.formState.errors.agentName ? "border-red-500" : ""
                        }`}
                      >
                        <SelectValue placeholder="Selecione um corretor" />
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Maria Rosa">Maria Rosa</SelectItem>
                      <SelectItem value="Vladimir Lima">Vladimir Lima</SelectItem>
                      <SelectItem value="Anderson Bertola">Anderson Bertola</SelectItem>
                      <SelectItem value="William Fidencio">William Fidencio</SelectItem>
                      <SelectItem value="Eric Nice">Eric Nice - (11) 95050 7175</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="propertyInterest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Terreno de Interesse (Lote/Quadra)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Lote 15 / Quadra 7"
                      {...field}
                      className={`rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${
                        form.formState.errors.propertyInterest ? "border-red-500" : ""
                      }`}
                      onBlur={(e) => {
                        field.onBlur()
                        form.trigger("propertyInterest")
                      }}
                      onChange={(e) => {
                        field.onChange(e)
                        if (e.target.value.length > 3) {
                          form.trigger("propertyInterest")
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informações adicionais sobre o cliente ou interesse"
                      {...field}
                      className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmation"
              render={({ field }) => (
                <FormItem
                  className={`flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 ${
                    form.formState.errors.confirmation ? "border-red-500" : ""
                  }`}
                >
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked)
                        form.trigger("confirmation")
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Confirmo que este cliente foi indicado por mim e que autorizou o contato pelo time da FPoles e/ou
                      Skan Hous.
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-all duration-200 font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar a Indicação"}
            </Button>
          </form>
        </Form>
      )}

      <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col items-center">
        <p className="text-sm text-gray-600 mb-4">Escaneie o QR code para acessar este formulário</p>
        <div className="bg-white p-2 rounded-lg shadow-sm">
          <QRCodeSVG
            value="https://lagoazul.skanhous.com.br"
            size={120}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"L"}
            includeMargin={false}
          />
        </div>
      </div>
    </div>
  )
}

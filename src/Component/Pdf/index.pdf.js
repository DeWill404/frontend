import { Document, Page, Text, View } from "@react-pdf/renderer";

export default function PDFDialog() {
  return (
    <Document title="Hello qw">
      <Page size="A4" orientation="landscape">
        <View>
          <Text>Section #1</Text>
          Section #1
        </View>
      </Page>
    </Document>
  );
}

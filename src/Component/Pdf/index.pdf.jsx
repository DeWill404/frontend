import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import {
  getTotalQuantity,
  getTotalWeight,
} from "../Pages/Designs/helper.designs";
import {
  calculateChangingWeight,
  calculateExtraWeight,
  calculateGrossWeight,
  calculateMetalWeight,
  getMetalDefaultData,
} from "../Pages/Orders/helper.order";
import { imagePath, parseDate } from "../../Helper/misc";

const sx = {
  title: { marginBottom: 12 },
  subtitle: { marginBottom: 6, fontSize: 12 },
  table: {
    border: "1px solid #333",
    borderRadius: 4,
  },
  v_divider: {
    height: "100%",
    borderRight: "1px solid #333",
  },
  divider: {
    borderBottom: "1px solid #333",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    minHeight: 27,
    alignItems: "center",
  },
  row: {
    display: "flex",
    flexDirection: "row",
  },
  cell: (width = 100) => ({
    padding: 4,
    minWidth: width,
    maxWidth: width,
    minHeight: 20,
  }),
};

export default function PDFDocument({ data }) {
  return (
    <Document title="Hello qw">
      <Page size="A4" orientation="landscape" style={{ padding: "8px 24px" }}>
        <Text
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "14px",
            marginBottom: 12,
          }}
        >
          FOR ME JEWELS
        </Text>
        <View style={{ fontSize: "11px" }}>
          <View style={{ display: "flex", flexDirection: "row", gap: 30 }}>
            <View>
              <View style={{ display: "flex", flexDirection: "row", gap: 30 }}>
                <View>
                  <Text style={{ ...sx.title, fontSize: 12 }}>
                    Order ID: {data.order_id}
                  </Text>

                  <Text style={{ ...sx.title, fontSize: 12 }}>
                    Design ID: {data.design.design_id}
                  </Text>

                  <View style={sx.title}>
                    <Text style={sx.subtitle}>Job Sheet</Text>
                    <View style={{ ...sx.table, width: "203px" }}>
                      <View style={sx.row}>
                        <Text style={sx.cell()}>Customer Name</Text>
                        <View style={sx.v_divider}></View>
                        <Text style={sx.cell()}>
                          {data.job_sheet.customer_name.value}
                        </Text>
                      </View>
                      <View style={sx.divider}></View>
                      <View style={sx.row}>
                        <Text style={sx.cell()}>Order Date</Text>
                        <View style={sx.v_divider}></View>
                        <Text style={sx.cell()}>
                          {parseDate(data.job_sheet.order_date.value)}
                        </Text>
                      </View>
                      <View style={sx.divider}></View>
                      <View style={sx.row}>
                        <Text style={sx.cell()}>Delivery Date</Text>
                        <View style={sx.v_divider}></View>
                        <Text style={sx.cell()}>
                          {parseDate(data.job_sheet.delivery_date.value)}
                        </Text>
                      </View>
                      <View style={sx.divider}></View>
                      <View style={sx.row}>
                        <Text style={sx.cell()}>Metal</Text>
                        <View style={sx.v_divider}></View>
                        <Text style={sx.cell()}>
                          {data.job_sheet.metal.value}
                        </Text>
                      </View>
                      <View style={sx.divider}></View>
                      <View style={sx.row}>
                        <Text style={sx.cell()}>KT</Text>
                        <View style={sx.v_divider}></View>
                        <Text style={sx.cell()}>{data.job_sheet.kt.value}</Text>
                      </View>
                      <View style={sx.divider}></View>
                      <View style={sx.row}>
                        <Text style={sx.cell()}>Pcs</Text>
                        <View style={sx.v_divider}></View>
                        <Text style={sx.cell()}>
                          {data.job_sheet.pcs.value}
                        </Text>
                      </View>
                      <View style={sx.divider}></View>
                      <View style={sx.row}>
                        <Text style={sx.cell()}>Rhodium</Text>
                        <View style={sx.v_divider}></View>
                        <Text style={sx.cell()}>
                          {data.job_sheet.rhodium.value}
                        </Text>
                      </View>
                      <View style={sx.divider}></View>
                      <View style={sx.row}>
                        <Text style={sx.cell()}>Product Type</Text>
                        <View style={sx.v_divider}></View>
                        <Text style={sx.cell()}>
                          {data.design.product_type.value}
                        </Text>
                      </View>
                      <View style={sx.divider}></View>
                      <View style={sx.row}>
                        <Text style={sx.cell()}>Product Size</Text>
                        <View style={sx.v_divider}></View>
                        <Text style={sx.cell()}>
                          {data.design.product_size.value}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View>
                  <Image
                    src={imagePath(data.design.ref_image.url)}
                    style={{
                      width: 200,
                      height: 200,
                      borderRadius: 4,
                      objectFit: "cover",
                    }}
                  />
                </View>
              </View>

              <View style={sx.title}>
                <Text style={sx.subtitle}>CAD Details</Text>
                <View style={{ ...sx.table, maxWidth: 365 }}>
                  <View
                    style={{
                      ...sx.row,
                      minHeight: 25,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Text style={sx.cell(70)}>Shape</Text>
                    <View style={sx.v_divider}></View>
                    <Text style={sx.cell(40)}>MM</Text>
                    <View style={sx.v_divider}></View>
                    <Text style={sx.cell(60)}>Dia. color</Text>
                    <View style={sx.v_divider}></View>
                    <Text style={sx.cell(55)}>Sive Size</Text>
                    <View style={sx.v_divider}></View>
                    <Text style={sx.cell(40)}>CTS</Text>
                    <View style={sx.v_divider}></View>
                    <Text style={sx.cell(50)}>Quantity</Text>
                    <View style={sx.v_divider}></View>
                    <Text style={sx.cell(40)}>Weight</Text>
                  </View>
                  <View style={sx.divider}></View>
                  {data.design.cad_data.map((cad, idx) => (
                    <View key={idx}>
                      <View style={sx.row}>
                        <Text style={sx.cell(70)}>{cad.shape.value}</Text>
                        <View style={sx.v_divider}></View>
                        <Text style={sx.cell(40)}>{cad.mm.value}</Text>
                        <View style={sx.v_divider}></View>
                        <Text style={sx.cell(60)}>{cad.dia_col.value}</Text>
                        <View style={sx.v_divider}></View>
                        <Text style={sx.cell(55)}>{cad.sive_size.value}</Text>
                        <View style={sx.v_divider}></View>
                        <Text style={sx.cell(40)}>{cad.cts.value}</Text>
                        <View style={sx.v_divider}></View>
                        <Text style={sx.cell(50)}>{cad.qty.value}</Text>
                        <View style={sx.v_divider}></View>
                        <Text style={sx.cell(40)}>{cad.weight.value}</Text>
                      </View>
                      <View style={sx.divider}></View>
                    </View>
                  ))}
                  <View style={sx.row}>
                    <Text style={sx.cell(269)}>Total Diamond Weight</Text>
                    <View style={sx.v_divider}></View>
                    <Text style={sx.cell(50)}>
                      {getTotalQuantity(data.design.cad_data)}
                    </Text>
                    <View style={sx.v_divider}></View>
                    <Text style={sx.cell(40)}>
                      {getTotalWeight(data.design.cad_data)}
                    </Text>
                    <View style={sx.divider}></View>
                  </View>
                </View>
              </View>
            </View>

            <View>
              <View style={{ minHeight: 215 }}>
                <View style={sx.title}>
                  <Text style={sx.subtitle}>Diamond Change</Text>
                  <View style={{ ...sx.table, maxWidth: 223 }}>
                    <View style={sx.header}>
                      <Text style={sx.cell(60)}>Size</Text>
                      <View style={sx.v_divider}></View>
                      <Text style={sx.cell(40)}>Pcs</Text>
                      <View style={sx.v_divider}></View>
                      <Text style={sx.cell(50)}>Weight</Text>
                      <View style={sx.v_divider}></View>
                      <Text style={sx.cell(70)}>Total Weight</Text>
                    </View>
                    <View style={sx.divider}></View>
                    {data.changing.map((cad, idx) => (
                      <View key={idx}>
                        <View style={sx.row}>
                          <Text style={sx.cell(60)}>{cad.size.value}</Text>
                          <View style={sx.v_divider}></View>
                          <Text style={sx.cell(40)}>{cad.pcs.value}</Text>
                          <View style={sx.v_divider}></View>
                          <Text style={sx.cell(50)}>{cad.wt.value}</Text>
                          <View style={sx.v_divider}></View>
                          <Text style={sx.cell(70)}>
                            {cad.total_weight.value}
                          </Text>
                        </View>
                        <View style={sx.divider}></View>
                      </View>
                    ))}
                    <View style={sx.row}>
                      <Text style={sx.cell(152)}>Total Diamond Weight</Text>
                      <View style={sx.v_divider}></View>
                      <Text style={sx.cell(40)}>
                        {calculateChangingWeight(data.changing)}
                      </Text>
                      <View style={sx.divider}></View>
                    </View>
                  </View>
                </View>
              </View>

              <View style={{ ...sx.title, marginLeft: -60 }}>
                <Text style={sx.subtitle}>Metal Details</Text>
                <View style={{ ...sx.table, maxWidth: 390 }}>
                  <View style={sx.header}>
                    <Text style={sx.cell(70)}>Department</Text>
                    <View style={sx.v_divider}></View>
                    <Text style={sx.cell(40)}>Pcs</Text>
                    <View style={sx.v_divider}></View>
                    <Text style={sx.cell(53)}>In Weight</Text>
                    <View style={sx.v_divider}></View>
                    <Text style={sx.cell(63)}>Out Weight</Text>
                    <View style={sx.v_divider}></View>
                    <Text style={sx.cell(68)}>Dust Weight</Text>
                    <View style={sx.v_divider}></View>
                    <Text style={sx.cell(90)}>Completion Date</Text>
                  </View>
                  <View style={sx.divider}></View>
                  {getMetalDefaultData(null, data).map((metal, idx) => (
                    <View key={idx}>
                      <View style={sx.row}>
                        <Text style={sx.cell(70)}>{metal.dept.value}</Text>
                        <View style={sx.v_divider}></View>
                        <Text style={sx.cell(40)}>{metal.pcs.value}</Text>
                        <View style={sx.v_divider}></View>
                        <Text style={sx.cell(53)}>{metal.in_wt.value}</Text>
                        <View style={sx.v_divider}></View>
                        <Text style={sx.cell(63)}>{metal.out_wt.value}</Text>
                        <View style={sx.v_divider}></View>
                        <Text style={sx.cell(68)}>{metal.dust_wt.value}</Text>
                        <View style={sx.v_divider}></View>
                        <Text style={sx.cell(90)}>
                          {parseDate(metal.complete_date.value)}
                        </Text>
                      </View>
                      <View style={sx.divider}></View>
                    </View>
                  ))}
                  <View style={sx.row}>
                    <Text style={sx.cell(111)}>Final Weight</Text>
                    <View style={sx.v_divider}></View>
                    <Text style={sx.cell(53)}>
                      {calculateMetalWeight(
                        getMetalDefaultData(null, data),
                        "in_wt"
                      )}
                    </Text>
                    <View style={sx.v_divider}></View>
                    <Text style={sx.cell(63)}>
                      {calculateMetalWeight(
                        getMetalDefaultData(null, data),
                        "out_wt"
                      )}
                    </Text>
                    <View style={sx.v_divider}></View>
                    <Text style={sx.cell(68)}>
                      {calculateMetalWeight(
                        getMetalDefaultData(null, data),
                        "dust_wt"
                      )}
                    </Text>
                    <View style={sx.v_divider}></View>
                  </View>
                </View>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 50,
                  marginLeft: -60,
                }}
              >
                <View style={sx.title}>
                  <Text style={sx.subtitle}>Extra Metal</Text>
                  <View style={{ ...sx.table, maxWidth: 103 }}>
                    <View style={sx.row}>
                      <Text style={sx.cell(60)}>Metal</Text>
                      <View style={sx.v_divider}></View>
                      <Text style={sx.cell(40)}>{data.extra.metal.value}</Text>
                    </View>
                    <View style={sx.divider}></View>
                    <View style={sx.row}>
                      <Text style={sx.cell(60)}>Wire</Text>
                      <View style={sx.v_divider}></View>
                      <Text style={sx.cell(40)}>{data.extra.wire.value}</Text>
                    </View>
                    <View style={sx.divider}></View>
                    <View style={sx.row}>
                      <Text style={sx.cell(60)}>Solder</Text>
                      <View style={sx.v_divider}></View>
                      <Text style={sx.cell(40)}>{data.extra.solder.value}</Text>
                    </View>
                    <View style={sx.divider}></View>
                    <View style={sx.row}>
                      <Text style={sx.cell(60)}>Total</Text>
                      <View style={sx.v_divider}></View>
                      <Text style={sx.cell(40)}>
                        {calculateExtraWeight(data.extra)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={sx.title}>
                  <Text style={sx.subtitle}>Summary</Text>
                  <View style={{ ...sx.table, maxWidth: 160 }}>
                    <View style={sx.row}>
                      <Text style={sx.cell(80)}>Gross Weight</Text>
                      <View style={sx.v_divider}></View>
                      <Text style={sx.cell(80)}>
                        {calculateGrossWeight(data)}
                      </Text>
                    </View>
                    <View style={sx.divider}></View>
                    <View style={sx.row}>
                      <Text style={sx.cell(80)}>Order Status</Text>
                      <View style={sx.v_divider}></View>
                      <Text style={sx.cell(80)}>{data.order_status}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

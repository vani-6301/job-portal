import dns from "dns";

dns.resolveSrv(
  "_mongodb._tcp.cluster0.8mbyanz.mongodb.net",
  (err, addresses) => {
    console.log(err);
    console.log(addresses);
  }
);
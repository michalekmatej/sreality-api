import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { API } from "@lib/api";
import { formatCurrency } from "@/globals/globals";

const DetailSection = () => {
    // get the id from the URL
    const { estateId } = useParams<{ estateId: string }>();

    // fetch estate detail
    const { data: estate, isLoading, isError, error } = useQuery({
        queryKey: ['estate', estateId],
        queryFn: () => API.fetchEstateDetail(estateId || ''),
    });

    if (isLoading) return <CircularProgress className="loading" />;
    if (isError) return <div>{error.message}</div>;

    return (
        <section className="detail-page">
            {isLoading ? <CircularProgress className="loading" /> :
                isError ? <div>{error}</div> :
                    <div className="container">
                        <h1 className="title">Detail inzerátu</h1>

                        <h2 className="subtitle">{estate?.name.value}</h2>

                        <p className="spec">Lokalita: {estate?.locality.value}</p>
                        <p className="spec">Cena: {formatCurrency(estate?.price_czk.value_raw)}</p>

                        <hr />

                        <div className="text">
                            {estate?.text.value.split('\n').map((text: string, index: number) => (
                                <p key={index}>{text}</p>
                            ))}
                        </div>

                        <hr />

                        <div className="images">
                            {estate?._embedded.images.map((image: any, index: number) => (
                                <img key={index} src={image._links.gallery.href} alt={estate?.name.value} />
                            ))}
                        </div>
                    </div>
            }
        </section>

    )
}

export default DetailSection;

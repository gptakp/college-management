export default function About() {
    return <>
        <img src={`${window.location.origin}/aboutus.png`} width="100%" height="350px" alt="aboutgvp" />
        <h2 style={{ background: "#FFFF00", color: "blue", textAlign: "center" , textTransform:"uppercase" }}>Brief about GVPCE</h2>
        <b style={{ fontSize: "15px" }}>
            The Gayatri Vidya Parishad College of Engineering [GVPCE] had its humble beginning in December
            1996 with 4 branches and 200 intake established under the parent society ‘Gayatri Vidya
            Parishad’(GVP), a non-profitable organization comprising of noted educationists and eminent
            philanthropists who have a missionary zeal to provide quality technical education. From that point
            on, the college has very quickly established itself as one of the most-preferred self-financing
            engineering colleges in Andhra Pradesh offering 10 B.Tech. Programs, 5 M.Tech. and one MCA
            Program approved by AICTE with an intake of 1260.
            <br />
            The following accreditations from the various Statutory Authorities speaks for itself.
        </b>
        <h2 style={{ background: "#92D050", color: "red", textAlign: "center"  , textTransform:"uppercase"}}>Accreditations</h2>
        <tbody><tr>
            <th>NAAC</th>
            <td>The College has been accredited by NAAC twice
                <b>with “A” grade</b> with a <b>CGPA of 3.47/4.00.</b></td>
        </tr>
            <tr>
                <th>NBA</th>
                <td>All B.Tech. programs accredited atleast twice so far.</td>
            </tr>
            <tr>
                <th>UGC</th>
                <td>
                    <ul style={{ marginLeft: "-25px" }} ><li>The college is sanctioned “Autonomous” status by the UGC and conferred by the then affiliating University, JNT University, Kakinada in 2009. </li>
                        <li>Inclusion under 2(f) and 12(B) of the UGC Act, 1956.</li></ul></td>
            </tr>
            <tr>
                <th>NIRF</th>
                <td>All India Ranking in NIRF consecutively for 6 years. Positioned in the Band of 151-300 in Innovation Category of NIRF India Rankings 2023. </td>
            </tr>
        </tbody>
        <h2 style={{ background: "#FBD4B4", color: "blue", textAlign: "center" , textTransform:"uppercase" }}>Highlights (Teaching &amp; Research)</h2>
        <ul>
            <li>Gayatri Vidya Parishad College of Engineering (EAMCET CODE: GVPE) remains the choicest destination next to Universities in UG Programs for students with Best EAMCET and ECET Ranks in the state of Andhra Pradesh and the same with GATE Qualified students in PG Programs</li>
            <li>Out of a total faculty strength of about 250, 122 are Ph.Ds. Further, our own faculty are guides/co-guides in facilitating award of Doctorate degree for 27 scholars and more than 156 scholars are pursuing Ph.D. under their guidance.  </li>
            <li>Houses GVP-Scientific &amp; Industrial Research Centre (GVP-SIRC) recognized as SIRO by DSIR,Ministry of Science and Technology, GoI. </li>
            <li>One among the 4 self-financing institutions in Andhra Pradesh selected by MHRD under TEQIPII, S.C.1.2 to receive a grant of Rs. 5 Cr. for upgrading the quality of PG education, research and innovation.</li>
            <li>Established the GVP-Prof. V. Lakshmikantham Institute of Advanced Studies (GVP-LIAS) in 2007 which is the offspring of Late Prof. Lakshmikantham’s (Distinguished Professor and Head of the Department of Mathematical Sciences at Florida Institute of Technology, Founder of the International Federation of Nonlinear Analysts, IFNA) vision for a research institute that encompasses a broad spectrum of areas and works in collaboration with Department of Mathematics in particular and other Engineering Departments in general. </li>
            <li>R &amp; D Projects funded by external agencies worth <b>Rs. 1306 lakhs</b></li>
            <li>Consultancy projects executed to a tune of Rs. 701 lakhs</li>
        </ul>
        <h2 style={{ background: "#C6D9F1", color: "red", textAlign: "center" , textTransform:"uppercase" }}>Highlights (Infrastructure)</h2>
        <ul>
            <li>Sprawl over an area of 21 acres with a total built up area of 44,000 m<sup>2</sup> the College is laden with lush greenery sight aiding to the ambience of learning and research.  The centrally located well groomed garden is a cynosure for all eyes.</li>
            <li>About 45 MoUs with Industry &amp; Institutions in India and abroad for enhancing academic &amp; Research pursuits</li>
            <li>Establishment of 7 Specialized Labs costing Rs. 2 Crores in collaboration with AP State Skill Development Corporation (APSSDC) and SIEMENS for imparting varied skill development trainings to students and faculty in addition to the department specific Labs.</li>
            <li>Very resourceful, updated Library and Sports Facilities</li>
        </ul>
        <h2 style={{ background: "#F2DBDB", color: "blue", textAlign: "center"  , textTransform:"uppercase"}}>Highlights (Students Related)</h2>
        <ul>
            <li>Around 84% of the Eligible Students placed in reputed companies in the AY 2022-23 with the highest pay package of Rs.44.00 lakhs. </li>
            <li>Students admitted to reputed institutes within and outside the country for higher studies.</li>
            <li>Promotion of entrepreneurial ability in students through the Institute Innovation Council</li>
            <li>Inculcation of service conception in students through extension activities like NSS, Centre for Social Responsibility (CFSR) and its wing units.</li>
            <li>Stress free and all round development  of Students through Gayatri College Cultural Club (GC<sup>3</sup>)</li>
            <li>Under the guidance of  a doctorate physical director, students excel not only at the University and Inter-University levels but also won laurels at National Level in Sports like Roller Hockey, Skating, Athletics, Swimming etc. </li>
        </ul>
        <h2 style={{ background: "#FFC000", color: "002060", textAlign: "center"  , textTransform:"uppercase"}}>Highlights (Faculty Related)</h2>
        <ul>
            <li>A.I.C.T.E. Scales of Pay for all the faculty cadres</li>
            <li>Support for Faculty career development through QIPs, Incentives for Paper / Book Publications etc. </li>
        </ul>
        <img src={`${window.location.origin}/Princis.png`} width="100%" height="350px" alt="principals"></img>
        <b>
            <center>Programmes Offered</center>
        </b>
    </>
}
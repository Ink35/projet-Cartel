<?php 
class Checklist {
    private int $id;
    private ?string $inter = "";
    private ?string $contrat_signed = "";
    private ?string $contrat_send = "";
    private ?string $facture_send = "";
    private ?string $mail_adv = "";
    private ?string $vhr = "";
    private ?string $touring = "";
    private ?string $form = "";
    private ?string $pre_settle = "";
    private ?string $movin = "";
    private ?string $justif_prod = "";
    private ?string $facture_contrat = "";
    private ?string $archive_status = "";
    public function __construct(private string $in_sale) {

    }

    public function toArray() {
        return [
            "checklist_ID" => $this->id,
            "in_sale" => $this->in_sale,
            "inter" => $this->inter,
            "contrat_signed" => $this->contrat_signed,
            "contrat_send" => $this->contrat_send,
            "facture_send" => $this->facture_send,
            "mail_adv" => $this->mail_adv,
            "vhr" => $this->vhr,
            "touring" => $this->touring,
            "form" => $this->form,
            "pre_settle" => $this->pre_settle,
            "movin" => $this->movin,
            "justif_prod" => $this->justif_prod,
            "facture_contrat" => $this->facture_contrat,
            "archive_status" => $this->archive_status,
        ];
    }

    

    /**
     * Get the value of id
     */ 
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set the value of id
     *
     * @return  self
     */ 
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Get the value of in_sale
     */ 
    public function getIn_sale()
    {
        return $this->in_sale;
    }

    /**
     * Set the value of in_sale
     *
     * @return  self
     */ 
    public function setIn_sale($in_sale)
    {
        $this->in_sale = $in_sale;

        return $this;
    }

    /**
     * Get the value of contrat_signed
     *
     * @return  mixed
     */
    public function getContrat_signed()
    {
        return $this->contrat_signed;
    }

    /**
     * Set the value of contrat_signed
     *
     * @param   mixed  $contrat_signed  
     *
     * @return  self
     */
    public function setContrat_signed($contrat_signed)
    {
        $this->contrat_signed = $contrat_signed;

        return $this;
    }

    /**
     * Get the value of contrat_send
     *
     * @return  mixed
     */
    public function getContrat_send()
    {
        return $this->contrat_send;
    }

    /**
     * Set the value of contrat_send
     *
     * @param   mixed  $contrat_send  
     *
     * @return  self
     */
    public function setContrat_send($contrat_send)
    {
        $this->contrat_send = $contrat_send;

        return $this;
    }

    /**
     * Get the value of facture_send
     *
     * @return  mixed
     */
    public function getFacture_send()
    {
        return $this->facture_send;
    }

    /**
     * Set the value of facture_send
     *
     * @param   mixed  $facture_send  
     *
     * @return  self
     */
    public function setFacture_send($facture_send)
    {
        $this->facture_send = $facture_send;

        return $this;
    }

    /**
     * Get the value of mail_adv
     *
     * @return  mixed
     */
    public function getMail_adv()
    {
        return $this->mail_adv;
    }

    /**
     * Set the value of mail_adv
     *
     * @param   mixed  $mail_adv  
     *
     * @return  self
     */
    public function setMail_adv($mail_adv)
    {
        $this->mail_adv = $mail_adv;

        return $this;
    }

    /**
     * Get the value of vhr
     *
     * @return  mixed
     */
    public function getVhr()
    {
        return $this->vhr;
    }

    /**
     * Set the value of vhr
     *
     * @param   mixed  $vhr  
     *
     * @return  self
     */
    public function setVhr($vhr)
    {
        $this->vhr = $vhr;

        return $this;
    }

    /**
     * Get the value of touring
     *
     * @return  mixed
     */
    public function getTouring()
    {
        return $this->touring;
    }

    /**
     * Set the value of touring
     *
     * @param   mixed  $touring  
     *
     * @return  self
     */
    public function setTouring($touring)
    {
        $this->touring = $touring;

        return $this;
    }

    /**
     * Get the value of form
     *
     * @return  mixed
     */
    public function getForm()
    {
        return $this->form;
    }

    /**
     * Set the value of form
     *
     * @param   mixed  $form  
     *
     * @return  self
     */
    public function setForm($form)
    {
        $this->form = $form;

        return $this;
    }

    /**
     * Get the value of pre_settle
     *
     * @return  mixed
     */
    public function getPre_settle()
    {
        return $this->pre_settle;
    }

    /**
     * Set the value of pre_settle
     *
     * @param   mixed  $pre_settle  
     *
     * @return  self
     */
    public function setPre_settle($pre_settle)
    {
        $this->pre_settle = $pre_settle;

        return $this;
    }

    /**
     * Get the value of movin
     *
     * @return  mixed
     */
    public function getMovin()
    {
        return $this->movin;
    }

    /**
     * Set the value of movin
     *
     * @param   mixed  $movin  
     *
     * @return  self
     */
    public function setMovin($movin)
    {
        $this->movin = $movin;

        return $this;
    }

    /**
     * Get the value of justif_prod
     *
     * @return  mixed
     */
    public function getJustif_prod()
    {
        return $this->justif_prod;
    }

    /**
     * Set the value of justif_prod
     *
     * @param   mixed  $justif_prod  
     *
     * @return  self
     */
    public function setJustif_prod($justif_prod)
    {
        $this->justif_prod = $justif_prod;

        return $this;
    }

    /**
     * Get the value of facture_contrat
     *
     * @return  mixed
     */
    public function getFacture_contrat()
    {
        return $this->facture_contrat;
    }

    /**
     * Set the value of facture_contrat
     *
     * @param   mixed  $facture_contrat  
     *
     * @return  self
     */
    public function setFacture_contrat($facture_contrat)
    {
        $this->facture_contrat = $facture_contrat;

        return $this;
    }

    /**
     * Get the value of archive_status
     *
     * @return  mixed
     */
    public function getArchive_status()
    {
        return $this->archive_status;
    }

    /**
     * Set the value of archive_status
     *
     * @param   mixed  $archive_status  
     *
     * @return  self
     */
    public function setArchive_status($archive_status)
    {
        $this->archive_status = $archive_status;

        return $this;
    }

    /**
     * Get the value of inter
     *
     * @return  mixed
     */
    public function getInter()
    {
        return $this->inter;
    }

    /**
     * Set the value of inter
     *
     * @param   mixed  $inter  
     *
     * @return  self
     */
    public function setInter($inter)
    {
        $this->inter = $inter;

        return $this;
    }
}